-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities_roles" (
    "identity_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "identities_roles_pkey" PRIMARY KEY ("identity_id","role_id")
);

-- CreateTable
CREATE TABLE "roles_permissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "roles_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "roles_name_idx" ON "roles"("name");

-- CreateIndex
CREATE INDEX "permissions_action_idx" ON "permissions"("action");

-- CreateIndex
CREATE INDEX "permissions_entity_idx" ON "permissions"("entity");

-- CreateIndex
CREATE INDEX "permissions_action_entity_idx" ON "permissions"("action", "entity");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_action_entity_key" ON "permissions"("action", "entity");

-- CreateIndex
CREATE INDEX "identities_roles_identity_id_idx" ON "identities_roles"("identity_id");

-- CreateIndex
CREATE INDEX "identities_roles_role_id_idx" ON "identities_roles"("role_id");

-- CreateIndex
CREATE INDEX "roles_permissions_role_id_idx" ON "roles_permissions"("role_id");

-- CreateIndex
CREATE INDEX "roles_permissions_permission_id_idx" ON "roles_permissions"("permission_id");

-- AddForeignKey
ALTER TABLE "identities_roles" ADD CONSTRAINT "identities_roles_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities_roles" ADD CONSTRAINT "identities_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
