import {Deck} from "../deck";

export class ShortDeckService implements Deck {
    suits: string[] = ["SPADES", "CLUBS", "DIAMONDS", "HEARTS"];
    values: (number | string)[] = [6, 7, 8, 9, 10, "JACK", "QUEEN", "KING", "ACE"];
}
