using Business_Directory.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Business_Directory.Controllers
{
    public class HomeController : Controller
    {
        User userData = null;
        // GET: Home
        public ActionResult Index()
        {
            if (userData != null)
            {
                ViewBag.userData = userData;
            }
            return View();
        }

        // GET: Login
        public ActionResult Login()
        {
            if (userData != null)
            {
                ViewBag.userData = userData;
            }
            return View();
        }
    }
}