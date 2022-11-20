export interface IRequest {
  id: number;
  chatId: number;
  messageId: number;
  from: string;
  to: string;
  dateFrom: string;
  dateTo: string;
  message: string;
  link: string;
  isRewardable: boolean;
}