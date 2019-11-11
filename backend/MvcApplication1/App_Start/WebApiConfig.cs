using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace MvcApplication1
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            config.Routes.MapHttpRoute(
                "Categories",
                "api/categories/{categoryId}",
                new { controller = "Categories", categoryId = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                "Products",
                "api/products/{productId}",
                new { controller = "Products", productId = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                "CategoryProducts",
                "api/categories/{categoryId}/products/{productId}",
                new { controller = "CategoryProducts", productId = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                "Customers",
                "api/customers/{companyName}",
                new { controller = "Customers", companyName = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                "Orders",
                "api/orders/{orderId}",
                new { controller = "Orders", orderId = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                "Order Items",
                "api/orders/{orderId}/items/{orderItemId}",
                new { controller = "OrderItems", orderItemId = RouteParameter.Optional }
            );
        }
    }
}
