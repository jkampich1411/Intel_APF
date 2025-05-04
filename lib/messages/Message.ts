import { APFMessage } from "../types/APFMessage";

export default abstract class Message {
  abstract type: APFMessage;
  abstract length: number;
  abstract toBytes(): Buffer;
}

