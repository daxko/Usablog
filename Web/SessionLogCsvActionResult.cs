using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Mvc;
using Web.Models;

namespace Web
{
	public class SessionLogCsvActionResult : FileResult
	{
		private IEnumerable<LogEntry> _entries;

		public SessionLogCsvActionResult(string filename, IEnumerable<LogEntry> logEntries) : base("text/csv")
		{
			_entries = logEntries;
			FileDownloadName = NormalizeFilename(filename);
		}

		protected override void WriteFile(HttpResponseBase response)
		{
			using (var writer = new StreamWriter(response.OutputStream, System.Text.Encoding.UTF8))
			{
				//render columns
				writer.WriteLine("\"Time\",\"Tag\",\"Text\"");

				foreach (var logEntry in _entries)
				{
					var elapsed = TimeSpan.FromMilliseconds(logEntry.ElapsedMillisecondsSinceSessionStart);
					writer.WriteLine("\"{0}\",\"{1}\",\"{2}\"",
					                 elapsed.ToString(@"h\:mm\:ss"),
					                 NormalizeStringField(logEntry.Tag),
					                 NormalizeStringField(logEntry.Content)
						);
				}

				writer.Flush();
				writer.Close();
			}
		}

		private static string NormalizeFilename(string filename)
		{
			if (!filename.EndsWith(".csv")) return filename + ".csv";
			return filename;
		}

		private static string NormalizeStringField(string value)
		{
			if (string.IsNullOrWhiteSpace(value))
				return value;
			return value.Replace("\"", "\\\"").Replace('\n', ' ');
		}
	}
}