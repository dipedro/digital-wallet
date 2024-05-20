import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { ISelectOptions } from 'src/shared/interfaces';


export interface IDBService {
	getClient(): Promise<PoolClient>;
	query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
	transaction<T>(callback: () => Promise<T>): Promise<T>;
}

@Injectable()
export class PGService implements OnModuleInit, OnModuleDestroy, IDBService {
  	private pool: Pool;
	private client: PoolClient | null = null;

    async onModuleInit() {
        this.pool = new Pool({
			user: process.env.PG_USER,
			host: process.env.PG_HOST,
			database: process.env.PG_DATABASE,
			password: process.env.PG_PASSWORD,
			port: parseInt(process.env.PG_PORT),
		});
    }

	async onModuleDestroy() {
		if (this.client) {
			this.client.release();
		}
		await this.pool.end();
	}

	async getClient(): Promise<PoolClient> {
		this.client = await this.pool.connect();

		return this.client;
	}

	async query<T = any>(text: string, params?: any[], queryOptions?: ISelectOptions): Promise<QueryResult<T>> {
		const client = await this.getClient();
		try {
			return await client.query(text, params);
		} finally {
			if (!queryOptions?.isTransaction && client) {
				client.release();
			}
		}
	}
	
	async transaction<T>(callback: () => Promise<T>): Promise<T> {
		const client = await this.getClient();
		try {
		  await client.query('BEGIN');
		  const result = await callback();
		  await client.query('COMMIT');
		  return result;
		} catch (error) {
		  await client.query('ROLLBACK');
		  throw error;
		} finally {
			if (client) {
				client.release();
			}
		}
	}
}
