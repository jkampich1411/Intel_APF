import { APFMessage } from "../types/APFMessage";
import Message from "./Message";

export default class APF_Global_Request extends Message {
  override type: APFMessage = APFMessage.GLOBAL_REQUEST;

  override get length(): number {
    return 6 +
      this.request.length;
  }

  constructor(
    readonly request: string,
    readonly wantReply: boolean,
  ) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.request.length, pos, pos += 4);
    buf.write(this.request, pos, pos += this.request.length, "ascii");
    buf.writeUIntBE(Number(this.wantReply), pos, pos += 1);

    return buf;
  }

  static fromBytes(data: Buffer): [APF_Global_Request, number] | null {
    if(data.length < 6) // at least 6 chars have to be there
      return null;

    let pos = 1;

    const requestLength = data.readUIntBE(pos, pos += 4);
    if(data.length < 6 + requestLength)
      return null;
    const request = data.subarray(pos, pos += requestLength).toString("ascii");

    const wantReply = !!data.readUIntBE(pos, pos += 1);

    return [new APF_Global_Request(request, wantReply), pos];
  }

}

