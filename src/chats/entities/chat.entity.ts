import {
    Column,
    CreateDateColumn,
    Entity, Generated, Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'chats' })
@Index(['chatId'], { unique: true })
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 'name': 'guid' })
    @Generated('uuid')
    guid: string;

    @Column({ 'name': 'chat_id', 'type': 'bigint' })
    chatId: number;

    @Column({ 'name': 'action', 'default': null })
    action: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
