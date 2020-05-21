using System;

namespace Coronado.Web.Controllers.Api
{
  public class UrlQuery
  {
    public Guid AccountId { get; set; }
    public int Page { get; set; }
    public bool LoadAll { get; set; }
  }

  public class ReportQuery
  {
      public int? Year { get; set; }

      public int SelectedYear {
          get {
              return Year ?? DateTime.Today.Year;
          }
      }

      public DateTime EndDate {
          get {
              var daysInMonth = DateTime.DaysInMonth(SelectedYear, DateTime.Today.Month);
              return SelectedYear == DateTime.Today.Year ?
                new DateTime(SelectedYear, DateTime.Today.Month, daysInMonth) :
                new DateTime(SelectedYear, 12, 31);
          }
      }

      public DateTime StartDate {
          get {
              return new DateTime(1, 1, SelectedYear);
          }
      }
  }
}
