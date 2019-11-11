namespace MvcApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class change_foreign_key_add_int_id : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.OrderItems", "Product_ProductId", "dbo.Products");
            DropIndex("dbo.OrderItems", new[] { "Product_ProductId" });
            RenameColumn(table: "dbo.OrderItems", name: "Product_ProductId", newName: "ProductId");
            AddForeignKey("dbo.OrderItems", "ProductId", "dbo.Products", "ProductId", cascadeDelete: true);
            CreateIndex("dbo.OrderItems", "ProductId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.OrderItems", new[] { "ProductId" });
            DropForeignKey("dbo.OrderItems", "ProductId", "dbo.Products");
            RenameColumn(table: "dbo.OrderItems", name: "ProductId", newName: "Product_ProductId");
            CreateIndex("dbo.OrderItems", "Product_ProductId");
            AddForeignKey("dbo.OrderItems", "Product_ProductId", "dbo.Products", "ProductId");
        }
    }
}
