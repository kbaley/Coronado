namespace Coronado.ConsoleApp
{
    public static class StringExtensions {

        public static string PadLeftWithDots(this string text, int totalWidth, bool includeTrailingDots = true)
        {
            if (text.Length > totalWidth) {
                return text.Substring(0, totalWidth) + (includeTrailingDots ? ".." : "");
            }

            return text.PadLeft(totalWidth, '.') + (includeTrailingDots ? ".." : "");
        }

        public static string PadRightWithDots(this string text, int totalWidth, bool includeTrailingDots = true)
        {
            if (text.Length > totalWidth) {
                return text.Substring(0, totalWidth) + (includeTrailingDots ? ".." : "");
            }

            return text.PadRight(totalWidth, '.') + (includeTrailingDots ? ".." : "");
        }
    }

    public static class DecimalExtensions {
        public static string PadLeftWithDots(this decimal number, int totalWidth, bool includeTrailingDots = true)
        {
            return number.ToString("#,##0.00").PadLeftWithDots(totalWidth, includeTrailingDots);
        }

        public static string PadRightWithDots(this decimal number, int totalWidth, bool includeTrailingDots = true)
        {
            return number.ToString("#,##0.00").PadRightWithDots(totalWidth, includeTrailingDots);
        }
    }
}
