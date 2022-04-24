import {ICard} from "../interfaces/ICard";
import {Deck} from "../decks/deck";
import {FullDeckService} from "../decks/providers/fullDeck.service";
import {ShortDeckService} from "../decks/providers/shortDeck.service";
import {ICardDeck} from "../interfaces/ICardDeck";
import {collections} from "./database.service";
import {v4 as uuidV4} from 'uuid';

export class CardDeckService {
    private deckService: Deck;
    private _type?: string;
    private _isShuffled?: boolean;

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get isShuffled(): boolean {
        return this._isShuffled;
    }

    set isShuffled(value: boolean) {
        this._isShuffled = value;
    }

    public init(type: string, isShuffled: boolean): void {
        this.type = type.toUpperCase();
        this.isShuffled = isShuffled;

        if (this.type === DeckType.full) {
            this.deckService = new FullDeckService();
        }

        if (this.type === DeckType.short) {
            this.deckService = new ShortDeckService();
        }
    }

    public generateNew(): Promise<ICardDeck> {
        const uuid: string = uuidV4();
        let seed: string = '';

        if (this.isShuffled) {
            seed = uuid + new Date().getTime().toString();
        }

        const deck: ICard[] = this.generate(seed);
        return this.save(uuid, deck, seed);
    }

    public async openDeck(deckId: string): Promise<ICardDeck> {
        return this.openDeckWithRemainingCards(deckId).then((cardDeck: ICardDeck) => {
            delete cardDeck.initialSize;
            delete cardDeck.seed;

            return cardDeck;
        });
    }

    public drawCard(deckId: string, count: number): Promise<ICard[]> {
        return this.openDeckWithRemainingCards(deckId).then((cardDeck: ICardDeck) => {
            const cardsTaken: number = cardDeck.initialSize - cardDeck.remaining;
            if (!cardDeck.cards?.length) {
                throw new Error("Deck is empty");
            }

            const cards = cardDeck.cards.splice(0, count);
            let remaining = cardDeck.initialSize - cardsTaken - count;

            if (remaining < 0) {
                remaining = 0;
            }

            cardDeck.remaining = remaining;

            CardDeckService.update(cardDeck);

            return cards;
        });
    }

    private async openDeckWithRemainingCards(deckId: string): Promise<ICardDeck> {
        const query = {deckId};
        const cardDeck = (await collections.cardDecks.findOne(query) as ICardDeck);

        if (!cardDeck?.deckId) {
            throw new Error('Deck not found!');
        }

        delete cardDeck._id;

        if (cardDeck.shuffled) {
            this.init(cardDeck.type, cardDeck.shuffled);
            const cards: ICard[] = this.generate(cardDeck.seed);
            this.shuffle(cards, cardDeck.seed);
            cardDeck.cards = cards;
        }

        if (!cardDeck.shuffled) {
            this.init(cardDeck.type, cardDeck.shuffled);
            cardDeck.cards = this.generate();
        }

        const cardsTaken: number = cardDeck.initialSize - cardDeck.remaining;

        if (cardsTaken >= cardDeck.initialSize) {
            cardDeck.cards = null;
        }

        if (cardsTaken < cardDeck.initialSize && cardDeck.cards?.length) {
            cardDeck.cards = cardDeck.cards.splice(cardsTaken);
        }

        return cardDeck;
    }

    public generate(seed?: string): ICard[] {
        const res: ICard[] = [];

        this.deckService.suits.forEach((suite) => {
            this.deckService.values.forEach((spade) => {
                res.push(
                    {
                        code: spade,
                        suit: suite,
                        value: this.getSpadeValue(spade) + suite.slice(0, 1)
                    }
                );
            })
        });

        if (this._isShuffled && (seed !== undefined || seed !== '')) {
            return this.shuffle(res, seed);
        }

        return res;
    }

    public shuffle(array: ICard[], seed: string): ICard[] {
        let currentIndex: number = array.length;
        const pseudoRandom = this.xmur3(seed);

        while (currentIndex !== 0) {
            const randomIndex: number = Math.floor(pseudoRandom * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    private async save(uuid: string, deck: ICard[], seed: string): Promise<ICardDeck> {
        const cardDeck = {
            deckId: uuid,
            type: this._type,
            shuffled: this._isShuffled,
            remaining: deck.length,
            initialSize: deck.length,
            seed,
        } as ICardDeck;

        await collections.cardDecks.insertOne({...cardDeck});

        delete cardDeck.initialSize;
        delete cardDeck.seed;

        return cardDeck;
    };

    private static update(cardDeck: ICardDeck): void {
        const query = {deckId: cardDeck.deckId};
        collections.cardDecks.updateOne(
            query,
            {
                $set: {
                    remaining: cardDeck.remaining
                }
            }
        );
    };

    public getSpadeValue(spade: string | number): string | number {
        if (typeof spade === 'number') {
            return spade;
        }

        return spade.slice(0, 1);
    }

    // https://stackoverflow.com/a/47593316
    public xmur3(str: string) {
        /* tslint:disable:no-bitwise */
        let h = 1779033703 ^ str.length;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
            h = h << 13 | h >>> 19;
        }

        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967295;
        /* tslint:enable:no-bitwise */
    }

}
