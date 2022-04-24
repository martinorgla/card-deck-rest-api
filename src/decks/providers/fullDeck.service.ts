import {Deck} from "../deck";

export class FullDeckService implements Deck {
    suits: string[] = ["SPADES", "CLUBS", "DIAMONDS", "HEARTS"];
    values: (number | string)[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "JACK", "QUEEN", "KING", "ACE"];
}
