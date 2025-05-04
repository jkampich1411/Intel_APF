import { APFMessage } from "../types/APFMessage";
import APF_Global_Request from "./APF_Global_Request";
import Message from "./Message";

export default class APF_UdpSendTo extends Message {
  override type = APFMessage.UDPSENDTO;

  override get length() {
    return 20 +
      this.headerBuffer.length +
      this.hostToConnect.length +
      this.originatorHost.length +
      this.data.length;
  }
  
  private readonly headerBuffer: Buffer;

  constructor(
    readonly hostToConnect: string,
    readonly portToConnect: number,
    readonly originatorHost: string,
    readonly originatorPort: number,
    readonly data: Buffer,
    readonly header?: APF_Global_Request,
  ) {
    super();

    if(!header)
      this.header = new APF_Global_Request("udp-send-to@amt.intel.com", false);
    this.headerBuffer = this.header!!.toBytes();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.set(this.headerBuffer, pos); pos += this.headerBuffer.length;
    buf.writeUIntBE(this.hostToConnect.length, pos, pos += 4);
    buf.write(this.hostToConnect, pos, pos += this.hostToConnect.length, "ascii");
    buf.writeUIntBE(this.portToConnect, pos, pos += 4);
    buf.writeUIntBE(this.originatorHost.length, pos, pos += 4);
    buf.write(this.originatorHost, pos, pos += this.originatorHost.length, "ascii");
    buf.writeUIntBE(this.originatorPort, pos, pos += 4);
    buf.writeUIntBE(this.data.length, pos, pos += 4);
    buf.set(this.data, pos); pos += this.data.length;

    return buf;
  }

  static fromBytes(data: Buffer): [APF_UdpSendTo, number] | null {
    let lenCurr = 20;
    if(data.length < lenCurr)
      return null;

    let pos = 0;

    const requestHeader = APF_Global_Request.fromBytes(data.subarray(pos));
    if (!requestHeader) return null;

    const [header, headerLen] = requestHeader;
    pos += headerLen;
    lenCurr += headerLen;

    const hostToConnectLength = data.readUIntBE(pos, pos += 4);
    lenCurr += hostToConnectLength;
    if(data.length < lenCurr)
      return null;
    const hostToConnect = data.subarray(pos, pos += hostToConnectLength).toString("ascii");
    const portToConnect = data.readUIntBE(pos, pos += 4);

    const originatorHostLength = data.readUIntBE(pos, pos += 4);
    lenCurr += originatorHostLength;
    if(data.length < lenCurr)
      return null;
    const originatorHost = data.subarray(pos, pos += originatorHostLength).toString("ascii");
    const originatorPort = data.readUIntBE(pos, pos += 4);

    const dataLength = data.readUIntBE(pos, pos += 4);
    const dataBuf = data.subarray(pos, pos += dataLength);

    return [
      new APF_UdpSendTo(
        hostToConnect,
        portToConnect,
        originatorHost,
        originatorPort,
        dataBuf,
        header
      ),
      pos
    ];
  }
}


