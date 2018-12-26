using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public interface ICurrencyRepository {
        Currency Get(string symbol);
        void Update(Currency currency);
        void Insert(Currency currency);
    }
}
