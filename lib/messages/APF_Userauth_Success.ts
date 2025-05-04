import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_Userauth_Success extends Message {
  override type = APFMessage.USERAUTH_SUCCESS;

  override length: number = 1;
  
  constructor() {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    
    return buf;
  }

  static fromBytes(data: Buffer): [APF_Userauth_Success, number] | null {
    if(data.length < 1)
      return null;

    let pos = 1;

    return [new APF_Userauth_Success(), pos];
  }
}
