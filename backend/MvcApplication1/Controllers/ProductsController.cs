using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class ProductsController : ApiController
    {
        ProdContext ProdContext;
        public ProductsController()
        {
            ProdContext = new ProdContext();
        }

        public IHttpActionResult Get()
        {
            var products =
                (from product in ProdContext.Products
                 select product)
                 .ToList();

            return Json(products);
        }
    }
}
