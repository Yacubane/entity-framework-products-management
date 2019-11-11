using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class OrderItemsController : ApiController
    {
        ProdContext ProdContext = new ProdContext();


        public void Post(int orderId, [FromBody]NewOrderItem newOrderItem)
        {
            Order order = getOrder(orderId);

            OrderItem orderItem = new OrderItem();
            orderItem.ProductId = newOrderItem.ProductId;
            orderItem.Count = newOrderItem.Count;

            Product product = ProdContext.Products
                .First(u => u.ProductId == newOrderItem.ProductId);

            product.UnitsInStock -= orderItem.Count;

            order.OrderItems.Add(orderItem);
            ProdContext.SaveChanges();
        }

      

        public void Delete(int orderId, int orderItemId)
        {
            var toDelete = ProdContext.OrderItems
                .First(u => (u.OrderItemId == orderItemId));

            //lazy loading of Product
            toDelete.Product.UnitsInStock += toDelete.Count;

            ProdContext.OrderItems.Remove(toDelete);
            ProdContext.SaveChanges();
        }

        private Order getOrder(int orderId)
        {
            return ProdContext.Orders
                .Include("OrderItems") //eager loading of OrderItems
                .First(u => u.OrderId == orderId);
      
        }
    }
}
