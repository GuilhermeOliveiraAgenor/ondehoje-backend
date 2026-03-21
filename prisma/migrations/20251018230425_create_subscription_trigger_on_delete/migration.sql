CREATE OR REPLACE FUNCTION trg_subscription_deletion_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "subscriptions_hist" (
    id,
    "company_id",
    "start_date",
    "end_date",
    "status",
    "created_at",
    "updated_at",
    "deleted_at",
    "created_by",
    "updated_by",
    "deleted_by"
  )
  VALUES (
    OLD.id,
    OLD."company_id",
    OLD."start_date",
    OLD."end_date",
    OLD."status",
    OLD."created_at",
    OLD."updated_at",
    NOW(),
    OLD."created_by",
    OLD."updated_by",
    OLD."updated_by"
  );

  RETURN NULL;
END;

$$ LANGUAGE plpgsql;

-- Criação da trigger que chama a função após a exclusão
CREATE TRIGGER trg_subscription_deletion
AFTER DELETE ON "subscriptions"
FOR EACH ROW
EXECUTE FUNCTION trg_subscription_deletion_function();