namespace Coronado.ConsoleApp
{
    public static class StringExtensions {

        public static string PadLeft(this string text, int totalWidth)
        {
            if (text.Length > totalWidth) {
                return text.Substring(0, totalWidth);
            }

            return text.PadLeft(totalWidth);
        }

        public static string PadRight(this string text, int totalWidth)
        {
            if (text.Length > totalWidth) {
                return text.Substring(0, totalWidth);
            }

            return text.PadRight(totalWidth);
        }
    }
}
