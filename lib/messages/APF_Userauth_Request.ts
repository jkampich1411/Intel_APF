import { APFMessage } from "../types/APFMessage";
import type { Service } from "./APF_Service_Request";
import Message from "./Message";

export type Method =
  "none" | "password";

export default class APF_Userauth_Request extends Message {
  override type: APFMessage = APFMessage.USERAUTH_REQUEST;

  override get length(): number {
    return 13 +
      this.username.length +
      this.serviceName.length +
      this.methodName.length + 
      (this.password ? 5 + this.password.length : 0);
  }

  constructor(
    readonly username: string,
    readonly serviceName: Service,
    public methodName: Method,
    public password?: string,
  ) {
    super();
    if(this.methodName === "none") this.password = undefined; 
  }

  override toBytes(): Buffer {
    let buf = Buffer.alloc(this.length, 0);
    let pos = 0;

    buf.writeUIntBE(this.type, pos, pos += 1);
    buf.writeUIntBE(this.username.length, pos, pos += 4);
    buf.write(this.username, pos, pos += this.username.length, "ascii");
    buf.writeUIntBE(this.serviceName.length, pos, pos += 4);
    buf.write(this.serviceName, pos, pos += this.serviceName.length, "ascii");
    buf.writeUIntBE(this.methodName.length, pos, pos += 4);
    buf.write(this.methodName, pos, pos += this.methodName.length, "ascii");

    if(this.methodName === "password" && this.password) {
      pos += 1;
      buf.writeUIntBE(this.password.length, pos, pos += 4);
      buf.write(this.password, pos, pos += this.password.length, "ascii");
    } else if(this.methodName === "password") {
      this.methodName = "none";
      return this.toBytes();
    }

    return buf;
  }

  static fromBytes(data: Buffer): [APF_Userauth_Request, number] | null {
    let lenCurr = 13;
    if(data.length < lenCurr) // at least 13 chars have to be there
      return null;

    let pos = 1;

    const usernameLength = data.readUIntBE(pos, pos += 4);
    lenCurr += usernameLength;
    if(data.length < lenCurr)
      return null;
    const username = data.subarray(pos, pos += usernameLength).toString("ascii");

    const serviceNameLength = data.readUIntBE(pos, pos += 4);
    lenCurr += serviceNameLength;
    if(data.length < lenCurr)
      return null;
    const serviceName = data.subarray(pos, pos += serviceNameLength).toString("ascii") as Service;

    const methodNameLength = data.readUIntBE(pos, pos += 4);
    lenCurr += methodNameLength;
    if(data.length < lenCurr)
      return null;
    const methodName = data.subarray(pos, pos += methodNameLength).toString("ascii") as Method;

    let password = undefined;
    if(methodName === "password") {
      pos += 1; // reserved bytes
      const passwordLength = data.readUIntBE(pos, pos += 4);
      lenCurr += passwordLength;
      if(data.length < lenCurr)
        return null;
      password = data.subarray(pos, pos += passwordLength).toString("ascii");
    }

    return [new APF_Userauth_Request(username, serviceName, methodName, password), pos];
  }

}

