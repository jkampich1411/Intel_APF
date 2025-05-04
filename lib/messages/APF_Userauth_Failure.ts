import { APFMessage } from "../types/APFMessage";
import type { Method } from "./APF_Userauth_Request";
import Message from "./Message";

export default class APF_Userauth_Failure extends Message {
  override type: APFMessage = APFMessage.USERAUTH_FAILURE;

  override get length(): number {
    return 6 + this.methodNameListJoined.length;
  }

  private readonly methodNameListJoined: string;

  constructor(readonly methodNameList: Method[]) {
    super();
    this.methodNameListJoined = this.methodNameList.join(",");
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.methodNameListJoined.length, pos, pos += 4);
    buf.write(this.methodNameListJoined, pos, pos += this.methodNameListJoined.length, "ascii");
    pos += 1;

    return buf;
  }

  static fromBytes(data: Buffer): [APF_Userauth_Failure, number] | null {
    if(data.length < 6) // at least 5 chars have to be there
      return null;

    let pos = 1;
    
    let methodNameListLength = data.readUIntBE(pos, pos += 4);
    if(data.length < 6 + methodNameListLength) // now the rest
      return null;
    let methodNameListJoined = data.subarray(pos, pos += methodNameListLength).toString("ascii");
    let methodNameList = methodNameListJoined.split(",") as Method[];

    pos += 1 // reserved bytes

    return [new APF_Userauth_Failure(methodNameList), pos];
  }

}
