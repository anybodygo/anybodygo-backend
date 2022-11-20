import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IRequest } from '../interfaces/request.interface';

@Entity({ 'name': 'requests' })
export class Request implements IRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 'name': 'chat_id' })
  chatId: number;

  @Column({ 'name': 'message_id' })
  messageId: number;

  @Column({ 'name': 'from' })
  from: string;

  @Column({ 'name': 'to' })
  to: string;

  @Column({ 'name': 'date_from' })
  dateFrom: string;

  @Column({ 'name': 'date_to' })
  dateTo: string;

  @Column({ 'name': 'message' })
  message: string;

  @Column({ 'name': 'link' })
  link: string;

  @Column({ 'default': false, 'name': 'is_rewardable' })
  isRewardable: boolean;
}