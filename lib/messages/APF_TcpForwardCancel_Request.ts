import { APFMessage } from "../types/APFMessage";
import APF_Global_Request from "./APF_Global_Request";
import Message from "./Message";

export default class APF_TcpForwardCancel_Request extends Message {
  override type = APFMessage.TCPFORWARDCANCEL_REQUEST;

  override get length() {
    return 8 +
      this.headerBuffer.length +
      this.addressToBind.length;
  }
  
  private readonly headerBuffer: Buffer;

  constructor(
    readonly addressToBind: string,
    readonly portToBind: number,
    readonly header?: APF_Global_Request,
  ) {
    super();

    if(!header)
      this.header = new APF_Global_Request("cancel-tcpip-forward", true);
    this.headerBuffer = this.header!!.toBytes();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.set(this.headerBuffer, pos); pos += this.headerBuffer.length;
    buf.writeUIntBE(this.addressToBind.length, pos, pos += 4);
    buf.write(this.addressToBind, pos, pos += this.addressToBind.length, "ascii");
    buf.writeUIntBE(this.portToBind, pos, pos += 4);

    return buf;
  }

  static fromBytes(data: Buffer): [APF_TcpForwardCancel_Request, number] | null {
    let lenCurr = 8;
    if(data.length < lenCurr)
      return null;

    let pos = 0;

    const requestHeader = APF_Global_Request.fromBytes(data.subarray(pos));
    if (!requestHeader) return null;

    const [header, headerLen] = requestHeader;
    pos += headerLen;
    lenCurr += headerLen;

    const bindAddressLength = data.readUIntBE(pos, pos += 4);
    lenCurr += bindAddressLength;
    if(data.length < lenCurr)
      return null;
    const bindAddress = data.subarray(pos, pos += bindAddressLength).toString("ascii");
    const bindPort = data.readUIntBE(pos, pos += 4);

    return [
      new APF_TcpForwardCancel_Request(
        bindAddress,
        bindPort,
        header
      ),
      pos
    ];
  }
}


