import {ICard} from "./ICard";
import {WithId} from "mongodb";

export interface ICardDeck extends WithId<Document> {
    deckId: string,
    type: string,
    shuffled: boolean,
    remaining: number;
    initialSize: number;
    seed?: string;
    cards?: ICard[];
}
