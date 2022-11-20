import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IRequest } from '../interfaces/request.interface';

@Entity({ 'name': 'requests' })
export class Request implements IRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 'name': 'chat_id', 'type': 'bigint' })
  chatId: number;

  @Column({ 'name': 'message_id', 'type': 'bigint' })
  messageId: number;

  @Column({ 'name': 'from' })
  from: string;

  @Column({ 'name': 'to' })
  to: string;

  @Column({ 'name': 'date_from', 'default': null })
  dateFrom: string;

  @Column({ 'name': 'date_to', 'default': null })
  dateTo: string;

  @Column({ 'name': 'message', 'default': null })
  message: string;

  @Column({ 'name': 'context', 'default': null })
  context: string;

  @Column({ 'name': 'link', 'default': null })
  link: string;

  @Column({ 'default': false, 'name': 'is_rewardable' })
  isRewardable: boolean;
}