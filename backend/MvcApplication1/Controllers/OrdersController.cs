using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class OrdersController : ApiController
    {
        ProdContext ProdContext;
        public OrdersController()
        {
            ProdContext = new ProdContext();
        }

        public IHttpActionResult Get()
        {
            IEnumerable<Order> orders =
                (from order in ProdContext.Orders
                     .Include("OrderItems")
                     .Include("OrderItems.Product")
                 select order)
                 .AsEnumerable();

            return Json(orders);
        }

        public void Post([FromBody]NewOrder newOrder)
        {
            Order order = new Order();
            order.CompanyName = newOrder.CompanyName;
            ProdContext.Orders.Add(order);
            ProdContext.SaveChanges();
        }

        public void Delete(int orderId)
        {
            IQueryable<Order> toDelete =
                from order in ProdContext.Orders.Include("OrderItems")
                where order.OrderId == orderId
                select order;

            foreach (var order in toDelete)
            {
                foreach (var orderItem in order.OrderItems)
                {
                    ProdContext.OrderItems.Remove(orderItem);
                }
                ProdContext.Orders.Remove(order);
            }

            ProdContext.SaveChanges();
        }
    }
}
