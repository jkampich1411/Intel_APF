import { APFMessage } from "../types/APFMessage";
import Message from "./Message";
import { stringify, parse } from "uuid";

export default class APF_ProtocolVersion extends Message {
  override type = APFMessage.PROTOCOLVERSION;
  override length: number = 93;
  
  constructor(
    readonly majorVersion: number,
    readonly minorVersion: number,
    readonly apfSystemId: string
  ) {
    super();
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.majorVersion, pos, pos += 4);
    buf.writeUIntBE(this.minorVersion, pos, pos += 4);
    pos += 4; // reserved bytes
    buf.set(parse(this.apfSystemId), pos);
    pos += 64; // reserved bytes
    
    return buf;
  }

  static fromBytes(data: Buffer): [APF_ProtocolVersion, number] | null {
    if(data.length < 93)
      return null;

    let pos = 1;

    const majorVersion = data.readUIntBE(pos, pos += 4);
    const minorVersion = data.readUIntBE(pos, pos += 4);
    pos += 4 // reserved bytes
    const apfSystemIdBuf = data.subarray(pos, pos += 16);
    const apfSystemIdUint8 = new Uint8Array(
      apfSystemIdBuf.buffer,
      apfSystemIdBuf.byteOffset,
      apfSystemIdBuf.byteLength
    );
    const apfSystemId = stringify(apfSystemIdUint8);
    pos += 64; // reserved bytes

    return [new APF_ProtocolVersion(majorVersion, minorVersion, apfSystemId), pos];
  }
}
