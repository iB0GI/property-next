interface Message {
  _id: string;
  createdAt: string | number | Date;
  sender: {
    _id: string;
    email: string;
  };
  recipient: string;
  property: {
    _id: string;
    name: string;
  };
  email: string;
  body: string;
  read: boolean;
}

export default Message;
