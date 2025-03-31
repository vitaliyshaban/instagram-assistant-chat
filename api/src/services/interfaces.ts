export interface IBody {
  object: string;
  entry: IEntry[];
}

export interface IEntry {
  id: string;
  time: number;
  messaging: IMessaging[];
}
export interface IMessaging {
  sender: ISender;
  recipient: IRecipient;
  timestamp: number;
  message?: IMessage;
  postback?: IPostback;
  read?: IRead;
}
export interface ISender {
  id: string;
}
export interface IRecipient {
  id: string;
}
export interface IMessage {
  mid: string;
  text: string;
}
export interface IPostback {
  title: string;
  payload: string;
  mid: string;
}
export interface IRead {
  mid: string;
}

export interface IBaseTemplate {
  recipient: {
    id: string;
  };
  message: {
    attachment: {
      type: string;
      payload: {
        template_type: string;
        elements: unknown[];
      };
    };
  };
}

export interface ITextTemplate {
  recipient: {
    id: string;
  };
  message: {
    text: string;
  };
}
