using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class CustomersController : ApiController
    {
        ProdContext ProdContext;
        public CustomersController()
        {
            ProdContext = new ProdContext();
        }

        public IHttpActionResult Get()
        {
            IEnumerable<Customer> Customers =
                (from customer in ProdContext.Customers
                 orderby customer.CompanyName descending
                 select customer)
                 .AsEnumerable();

            return Json(Customers);
        }

        public void Post([FromBody]NewCustomer newCustomer)
        {
            Customer customer = new Customer();
            customer.CompanyName = newCustomer.CompanyName;
            customer.Description = newCustomer.Description;
            ProdContext.Customers.Add(customer);
            ProdContext.SaveChanges();
        }

        public void Put(string companyName, [FromBody]NewCustomer editedCustomer)
        {
            Customer toEdit =
                 (from customer in ProdContext.Customers
                  where customer.CompanyName == companyName
                  select customer)
                  .First();

            toEdit.CompanyName = editedCustomer.CompanyName;
            toEdit.Description = editedCustomer.Description;
            ProdContext.SaveChanges();

        }

        public void Delete(string companyName)
        {
            Customer toDelete =
                (from customer in ProdContext.Customers
                where customer.CompanyName == companyName
                select customer)
                .First();

            ProdContext.Customers.Remove(toDelete);
            ProdContext.SaveChanges();
        }
    }
}
