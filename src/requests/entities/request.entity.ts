import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, Generated, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {RequestDirection} from '../../request-directions/entities/request-direction.entity';


@Entity({ name: 'requests' })
export class Request {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 'name': 'guid' })
    @Generated('uuid')
    guid: string;

    @Column({ 'name': 'chat_id', 'type': 'bigint' })
    chatId: number;

    @Column({ 'name': 'message_id', 'type': 'bigint' })
    messageId: number;

    @Column({ 'name': 'user_id', 'type': 'bigint' })
    userId: number;

    @Column({ 'name': 'chat_name', 'type': 'text' })
    chatName: string;

    @Column({ 'name': 'chat_link', 'type': 'text' })
    chatLink: string;

    @Column({ 'name': 'message_link', 'type': 'text' })
    messageLink: string;

    @Column({ 'name': 'from', 'type': 'simple-array' })
    from: string[];

    @Column({ 'name': 'to', 'type': 'simple-array' })
    to: string[];

    @Column({ 'name': 'date_from' })
    dateFrom: Date;

    @Column({ 'name': 'date_to' })
    dateTo: Date;

    @Column({ 'name': 'message', 'type': 'text', 'default': null })
    message: string;

    @Column({ 'name': 'context', 'default': null })
    context: string;

    @Column({ 'name': 'volume', 'default': null })
    volume: string;

    @Column({ 'name': 'has_reward', 'default': null })
    hasReward: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @OneToMany(() => RequestDirection, (direction) => direction.request)
    directions: RequestDirection[]
}
