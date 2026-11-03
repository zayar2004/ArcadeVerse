ALTER TABLE "coin_ledger" DROP CONSTRAINT "coin_ledger_session_id_game_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "ticket_ledger" DROP CONSTRAINT "ticket_ledger_session_id_game_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "ticket_ledger" DROP CONSTRAINT "ticket_ledger_redemption_id_redemption_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "coin_ledger" ADD CONSTRAINT "coin_ledger_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_ledger" ADD CONSTRAINT "ticket_ledger_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_ledger" ADD CONSTRAINT "ticket_ledger_redemption_id_redemption_orders_id_fk" FOREIGN KEY ("redemption_id") REFERENCES "public"."redemption_orders"("id") ON DELETE restrict ON UPDATE no action;


--> statement-breakpoint
CREATE OR REPLACE FUNCTION prevent_ledger_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Ledger records are append-only; use compensating entries';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER coin_ledger_no_update_delete
BEFORE UPDATE OR DELETE ON "coin_ledger"
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_mutation();
--> statement-breakpoint
CREATE TRIGGER ticket_ledger_no_update_delete
BEFORE UPDATE OR DELETE ON "ticket_ledger"
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_mutation();
