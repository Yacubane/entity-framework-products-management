using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;


namespace MvcApplication1.Models
{
    public class ProdContext : DbContext
    {
        public ProdContext()
            : base("name=DefaultConnection")
        { }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>()
            .HasOptional<Customer>(s => s.Customer)
            .WithMany()
            .WillCascadeOnDelete(true);
        }

    }
}
