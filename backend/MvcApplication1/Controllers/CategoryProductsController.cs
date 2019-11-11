using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class CategoryProductsController : ApiController
    {
        ProdContext ProdContext = new ProdContext();

        public IHttpActionResult Get(int categoryId)
        {
            IEnumerable<Product> products =
                (from category in ProdContext.Categories.Include("Products")
                 where category.CategoryId == categoryId
                 select category.Products)
                .First()
                .AsEnumerable();

            return Json(products);
        }

        public void Post(int categoryId, [FromBody]NewProduct newProduct)
        {
            Category category = getCategory(categoryId);

            Product product = new Product();
            product.Name = newProduct.Name;
            product.Unitprice = newProduct.Unitprice;
            product.UnitsInStock = newProduct.UnitsInStock;

            category.Products.Add(product);
            ProdContext.SaveChanges();
        }

        public void Put(int categoryId, int productId, [FromBody]NewProduct editedProduct)
        {
            Product toEdit =
                 (from product in ProdContext.Products
                  where product.ProductId == productId
                  select product)
                 .First();

            toEdit.Name = editedProduct.Name;
            toEdit.Unitprice = editedProduct.Unitprice;
            toEdit.UnitsInStock = editedProduct.UnitsInStock;
            ProdContext.SaveChanges();

        }

        public void Delete(int categoryId, int productId)
        {
            var toDelete =
                (from product in ProdContext.Products
                 where product.ProductId == productId
                 select product)
                 .First();

            ProdContext.Products.Remove(toDelete);
            ProdContext.SaveChanges();
        }

        private Category getCategory(int categoryId)
        {
            return
                (from category in ProdContext.Categories.Include("Products")
                 where category.CategoryId == categoryId
                 select category)
                 .First();
        }
    }
}
