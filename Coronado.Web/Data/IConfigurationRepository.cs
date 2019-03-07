namespace Coronado.Web.Data
{
    public interface IConfigurationRepository
    {
        string GetInvoiceTemplate();
        void UpdateInvoiceTemplate(string template);
    }
}
