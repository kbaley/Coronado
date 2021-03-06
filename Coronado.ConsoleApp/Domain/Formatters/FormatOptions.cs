using System;

namespace Coronado.ConsoleApp.Domain.Formatters
{
    public class FormatOptions {
        public int Width { get; set; }
        public Alignment Align { get; set; }
        public bool IncludeTrailingDots { get; set; }
        public string FormatString { get; set; }

        public FormatOptions(int width, Alignment alignment, bool includeTrailingDots, string formatString) {
            Width = width;
            Align = alignment;
            IncludeTrailingDots = includeTrailingDots;
            FormatString = formatString;
        }

        public FormatOptions(Alignment alignment, bool includeTrailingDots, string formatString) 
            : this(0, alignment, includeTrailingDots, formatString) { }

        public string Format(string item) {
            var formatted = Align == Alignment.LEFT 
                ? item.PadRightWithDots(Width, IncludeTrailingDots)
                : item.PadLeftWithDots(Width, IncludeTrailingDots);
            return formatted;
        }

        public string Format(double item) {
            var formatted = item.ToString(FormatString);
            formatted = Align == Alignment.LEFT 
                ? formatted.PadRightWithDots(Width, IncludeTrailingDots)
                : formatted.PadLeftWithDots(Width, IncludeTrailingDots);
            return formatted;
        }

        public string Format(decimal item) {
            var formatted = item.ToString(FormatString);
            formatted = Align == Alignment.LEFT 
                ? formatted.PadRightWithDots(Width, IncludeTrailingDots)
                : formatted.PadLeftWithDots(Width, IncludeTrailingDots);
            return formatted;
        }

        public string Format(DateTime item) {
            var formatted = item.ToString(FormatString);
            formatted = Align == Alignment.LEFT 
                ? formatted.PadRightWithDots(Width, IncludeTrailingDots)
                : formatted.PadLeftWithDots(Width, IncludeTrailingDots);
            return formatted;
        }
    }

    public class FormatString {
        public const string STRING = "";
        public const string DECIMAL = "#,##0.00";
        public const string PERCENTAGE = "P2";
        public const string CURRENCY = "C2";
        public const string SHORT_DATE = "M/d/yyyy";
    }

    public enum Alignment {
        LEFT,
        RIGHT
    }

}
