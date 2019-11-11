namespace MvcApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateforeignkey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "CompanyName", c => c.String(maxLength: 128));
            AddForeignKey("dbo.Orders", "CompanyName", "dbo.Customers", "CompanyName");
            CreateIndex("dbo.Orders", "CompanyName");
            DropColumn("dbo.Orders", "CustomerId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Orders", "CustomerId", c => c.Int(nullable: false));
            DropIndex("dbo.Orders", new[] { "CompanyName" });
            DropForeignKey("dbo.Orders", "CompanyName", "dbo.Customers");
            DropColumn("dbo.Orders", "CompanyName");
        }
    }
}
