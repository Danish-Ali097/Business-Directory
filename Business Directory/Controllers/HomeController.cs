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
        business_directorydbEntities1 db = new business_directorydbEntities1();
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

        [HttpPost]
        public ActionResult Login(User user)
        {
            var userList = db.Users.ToList();
            foreach (var usr in userList)
            {
                if (usr.UserName.Equals(user.UserName) && usr.Password.Equals(user.Password))
                {
                    userData = usr;
                    return RedirectToAction("Index");
                }
            }
            if (userData != null)
            {
                ViewBag.userData = userData;
            }
            ViewBag.error = "User Cradentials are invalid";
            return View();
        }

        // GET: Signup
        public ActionResult Signup()
        {
            if (userData != null)
            {
                ViewBag.userData = userData;
            }
            return View();
        }

        [HttpPost]
        public ActionResult Signup(User user)
        {
            var userList = db.Users.ToList();
            foreach (var usr in userList)
            {
                if (usr.UserName.Equals(user.UserName))
                {
                    ViewBag.error = "UserName already registered";
                    return View();
                }
            }
            db.Users.Add(user);
            db.SaveChanges();
            return View();
        }
    }
}