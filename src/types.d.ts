import { Carer } from './api/types';

declare module "*.jpg";

type Capability = {
  id: string;
  name: string;
  icon: string;
};

type Message = {
  _id: string;
  text: string;
  createdAt: string;
  senderID: string;
  receiverID: string;
};

type CarerWithCount = Carer & {
  unreadMessageCount: number;
};
