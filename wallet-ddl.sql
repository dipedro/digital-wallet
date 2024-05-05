SELECT 'CREATE DATABASE wallet' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'wallet')\gexec

\c wallet

CREATE TABLE IF NOT EXISTS public.wallets (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	balance DECIMAL(10, 2) NOT NULL DEFAULT 0
);

DO $$
BEGIN
	INSERT INTO wallets (id, balance) 
	VALUES 
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 2000.00)
	ON CONFLICT DO NOTHING;
END $$;

SELECT 'CREATE DATABASE extract' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'extract')\gexec

\c extract

CREATE TABLE IF NOT EXISTS public.extracts (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	wallet_id UUID NOT NULL,
	type VARCHAR(255) NOT NULL,
	amount DECIMAL(10, 2) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
	INSERT INTO extracts (wallet_id, type, amount) 
	VALUES 
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 'deposit', 200.00),
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 'deposit', 300.00),
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 'deposit', 500.00),
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 'deposit', 1000.00)
	ON CONFLICT DO NOTHING;
END $$;

SELECT 'CREATE DATABASE transaction' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'transaction')\gexec

\c transaction

CREATE TABLE IF NOT EXISTS public.transactions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	wallet_id UUID NOT NULL,
	type VARCHAR(255) NOT NULL,
	amount DECIMAL(10, 2) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
	INSERT INTO transactions (wallet_id, type, amount) 
	VALUES 
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 'deposit', 200.00),
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 'deposit', 300.00),
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 'deposit', 500.00),
		('614b324f-5ce7-4243-93f9-d9e9b989b3df', 'deposit', 1000.00)
	ON CONFLICT DO NOTHING;
END $$;