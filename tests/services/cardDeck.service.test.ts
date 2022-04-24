import {CardDeckService} from "../../src/services/cardDeck.service";
import {ICard} from "../../src/interfaces/ICard";

const testCards: ICard[] = [
    {
        "code": "JACK",
        "suit": "SPADES",
        "value": "JS"
    },
    {
        "code": "JACK",
        "suit": "CLUBS",
        "value": "JC"
    },
    {
        "code": "JACK",
        "suit": "DIAMONDS",
        "value": "JD"
    },
    {
        "code": "JACK",
        "suit": "HEARTS",
        "value": "JH"
    },
];

describe('testing cardDeck service', () => {
    test('should generate SHORT deck', () => {
        const deckService1 = new CardDeckService();
        deckService1.init('SHORT', false);
        const cards1 = deckService1.generate();

        expect(cards1).toHaveLength(36);
    });

    test('should generate FULL deck', () => {
        const deckService2 = new CardDeckService();
        deckService2.init('FULL', false);
        const cards2 = deckService2.generate();

        expect(cards2).toHaveLength(52);
    });

    test('should generate FULL deck shuffled', () => {
        const deckService3 = new CardDeckService();
        deckService3.init('FULL', true);
        const shuffledCard1 = deckService3.generate("1f97-cf5ab72e");

        expect(shuffledCard1).toHaveLength(52);
        expect(shuffledCard1[0].value).toBe('2S');
        expect(shuffledCard1[26].value).toBe('3C');
        expect(shuffledCard1[51].value).toBe('4D');
    });

    test('should shuffle', () => {
        const deckService4 = new CardDeckService();
        const shuffledCard2: ICard[] = deckService4.shuffle([...testCards], "2f97-cf5ab72e");

        expect(shuffledCard2).toHaveLength(4);
        expect(shuffledCard2[0].value).toBe('JC');
        expect(shuffledCard2[1].value).toBe('JD');
        expect(shuffledCard2[2].value).toBe('JH');
        expect(shuffledCard2[3].value).toBe('JS');
    });

    test('should get different results with seeds', () => {
        const deckService5 = new CardDeckService();
        const shuffledCards3: ICard[] = deckService5.shuffle([...testCards], "2f97-cf5ab72e");
        const shuffledCards4: ICard[] = deckService5.shuffle([...testCards], "2f97-cf5ab72z");
        const shuffledCards5: ICard[] = deckService5.shuffle([...testCards], "1f97-cf5ab72e");

        expect(shuffledCards3).toHaveLength(4);
        expect(shuffledCards4).toHaveLength(4);
        expect(shuffledCards5).toHaveLength(4);

        expect(testCards).not.toBe(shuffledCards3);
        expect(testCards).not.toBe(shuffledCards4);
        expect(testCards).not.toBe(shuffledCards5);
        expect(shuffledCards3).not.toBe(shuffledCards4);
        expect(shuffledCards3).not.toBe(shuffledCards5);
        expect(shuffledCards4).not.toBe(shuffledCards5);
    });
});

describe('test helper functions', () => {
    test('test spade values', () => {
        const deckService6 = new CardDeckService();

        expect(deckService6.getSpadeValue(10)).toBe(10);
        expect(deckService6.getSpadeValue("KING")).toBe("K");
    });

    test('test seed generator', () => {
        const deckService6 = new CardDeckService();

        expect(deckService6.xmur3('random-1')).not.toBe(deckService6.xmur3('random-2'));
        expect(deckService6.xmur3('random-1')).toBe(0.5057696049347915);
    });
});
