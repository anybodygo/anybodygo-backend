export interface IRequest {
  id: number;
  chatId: number;
  messageId: number;
  dateFrom: string;
  dateTo: string;
  message: string;
  link: string;
  isRewardable: boolean;
}