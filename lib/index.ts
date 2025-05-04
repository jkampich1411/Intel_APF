export * from "./messages";
export * from "./types";

import { APFMessage } from "./types";
import {
  Message,
  APF_Disconnect,
  APF_Service_Request,
  APF_Service_Accept,
  APF_Userauth_Request,
  APF_Userauth_Failure,
  APF_Userauth_Success,
  APF_Request_Success,
  APF_Request_Failure,
  APF_ChannelOpen_Request,
  APF_ChannelOpen_Confirmation,
  APF_ChannelOpen_Failure,
  APF_ChannelWindowAdjust,
  APF_ChannelData,
  APF_ChannelClose,
  APF_ProtocolVersion,
  APF_Keepalive_Request,
  APF_Keepalive_Reply,
  APF_Keepalive_Options_Request,
  APF_Keepalive_Options_Reply,
  APF_Global_Request,
  APF_TcpForward_Request,
  APF_TcpForwardCancel_Request,
  APF_UdpSendTo,
} from "./messages";

export function decodeMessage(data: Buffer): [Message, number] | null {
  const type = data.readUintBE(0, 1) as APFMessage;

  switch(type) {
    case APFMessage.DISCONNECT:
      return APF_Disconnect.fromBytes(data);

    case APFMessage.SERVICE_REQUEST:
      return APF_Service_Request.fromBytes(data);

    case APFMessage.SERVICE_ACCEPT:
      return APF_Service_Accept.fromBytes(data);

    case APFMessage.USERAUTH_REQUEST:
      return APF_Userauth_Request.fromBytes(data);
    
    case APFMessage.USERAUTH_FAILURE:
      return APF_Userauth_Failure.fromBytes(data);
    
    case APFMessage.USERAUTH_SUCCESS:
      return APF_Userauth_Success.fromBytes(data);
    
    case APFMessage.REQUEST_SUCCESS:
      return APF_Request_Success.fromBytes(data);
    
    case APFMessage.REQUEST_FAILURE:
      return APF_Request_Failure.fromBytes(data);
    
    case APFMessage.CHANNEL_OPEN:
      return APF_ChannelOpen_Request.fromBytes(data);

    case APFMessage.CHANNEL_OPEN_CONFIRMATION:      
      return APF_ChannelOpen_Confirmation.fromBytes(data);

    case APFMessage.CHANNEL_OPEN_FAILURE:
      return APF_ChannelOpen_Failure.fromBytes(data);
    
    case APFMessage.CHANNEL_WINDOW_ADJUST:
      return APF_ChannelWindowAdjust.fromBytes(data);
    
    case APFMessage.CHANNEL_DATA:
      return APF_ChannelData.fromBytes(data);

    case APFMessage.CHANNEL_CLOSE:
      return APF_ChannelClose.fromBytes(data);

    case APFMessage.PROTOCOLVERSION:
      return APF_ProtocolVersion.fromBytes(data);

    case APFMessage.KEEPALIVE_REQUEST:
      return APF_Keepalive_Request.fromBytes(data);

    case APFMessage.KEEPALIVE_REPLY:
      return APF_Keepalive_Reply.fromBytes(data);

    case APFMessage.KEEPALIVE_OPTIONS_REQUEST:
      return APF_Keepalive_Options_Request.fromBytes(data);

    case APFMessage.KEEPALIVE_OPTIONS_REPLY:
      return APF_Keepalive_Options_Reply.fromBytes(data);

    case APFMessage.GLOBAL_REQUEST:
      const parsedHeaderData = APF_Global_Request.fromBytes(data);
      if (!parsedHeaderData) return null;
      const parsedHeader = parsedHeaderData[0];
      if (parsedHeader.request === "tcpip-forward")
        return APF_TcpForward_Request.fromBytes(data);
      else if (parsedHeader.request === "cancel-tcpip-forward")
        return APF_TcpForwardCancel_Request.fromBytes(data);
      else if (parsedHeader.request === "udp-send-to@amt.intel.com")
        return APF_UdpSendTo.fromBytes(data);

      return null;

    default:
      return null;
  }
}

export function decodeAsMuchAsPossible(data: Buffer): [Message[], number] {
  let pos = 0;
  let messages: Message[] = [];

  while(pos < data.length) {
    let curr = decodeMessage(data.subarray(pos));
    if(!curr) break;

    let [msg, decoded] = curr;    
    messages.push(msg);
    pos += decoded;
  }

  return [messages, pos];
}
