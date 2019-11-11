namespace MvcApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changedmodel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Orders", "CompanyName", "dbo.Customers");
            DropIndex("dbo.Orders", new[] { "CompanyName" });
            AddForeignKey("dbo.Orders", "CompanyName", "dbo.Customers", "CompanyName", cascadeDelete: true);
            CreateIndex("dbo.Orders", "CompanyName");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Orders", new[] { "CompanyName" });
            DropForeignKey("dbo.Orders", "CompanyName", "dbo.Customers");
            CreateIndex("dbo.Orders", "CompanyName");
            AddForeignKey("dbo.Orders", "CompanyName", "dbo.Customers", "CompanyName");
        }
    }
}
