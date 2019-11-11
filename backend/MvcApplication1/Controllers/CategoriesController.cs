using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class CategoriesController : ApiController
    {
        ProdContext ProdContext;
        public CategoriesController()
        {
            ProdContext = new ProdContext();
        }

        public IHttpActionResult Get()
        {
            var categories =
                (from category in ProdContext.Categories.Include("Products")
                 orderby category.CategoryId ascending
                 select category);

            return Json(categories);
        }

        public void Post([FromBody]NewCategory NewCategory)
        {
            Category category = new Category();
            category.Name = NewCategory.Name;
            category.Description = NewCategory.Description;
            ProdContext.Categories.Add(category);
            ProdContext.SaveChanges();
        }

        public void Put(int categoryId, [FromBody]NewCategory editedCategory)
        {
            Category toEdit =
                 (from category in ProdContext.Categories
                  where category.CategoryId == categoryId
                  select category)
                  .First();

            toEdit.Name = editedCategory.Name;
            toEdit.Description = editedCategory.Description;
            ProdContext.SaveChanges();

        }

        public void Delete(int categoryId)
        {
            var toDelete =
                from category in ProdContext.Categories.Include("Products")
                where category.CategoryId == categoryId
                select category;

            foreach (var category in toDelete)
            {
                foreach (var product in category.Products)
                {
                    ProdContext.Products.Remove(product);
                }
                ProdContext.Categories.Remove(category);
            }

            ProdContext.SaveChanges();
        }
    }
}
