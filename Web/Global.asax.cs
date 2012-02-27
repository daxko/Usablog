﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Raven.Abstractions.Data;
using Raven.Client;
using Raven.Client.Document;

namespace Web
{
	// Note: For instructions on enabling IIS6 or IIS7 classic mode, 
	// visit http://go.microsoft.com/?LinkId=9394801

	public class MvcApplication : System.Web.HttpApplication
	{
		public static void RegisterGlobalFilters(GlobalFilterCollection filters)
		{
			filters.Add(new HandleErrorAttribute());
		}

		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

			routes.MapRoute(
				"Default", // Route name
				"{controller}/{action}/{*id}", // URL with parameters
				new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
			);

		}

		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();

			var parser = ConnectionStringParser<RavenConnectionStringOptions>.FromConnectionStringName("RavenDB");
			parser.Parse();

			Store = new DocumentStore
			{
				ApiKey = parser.ConnectionStringOptions.ApiKey,
				Url = parser.ConnectionStringOptions.Url,
			};
			Store.Initialize();

			RegisterGlobalFilters(GlobalFilters.Filters);
			RegisterRoutes(RouteTable.Routes);
		}

		protected void Application_Error(object sender, EventArgs e)
		{
			try
			{
				var exception = Server.GetLastError();
				Errors.Add(exception);
			}
			catch (Exception)
			{
				// this would stink
			}
		}

		public static IList<Exception> Errors = new List<Exception>(); 
		public static IDocumentStore Store { get; private set; }
	}
}