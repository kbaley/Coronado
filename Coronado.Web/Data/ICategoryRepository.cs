using System;
using System.Collections.Generic;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{

    public interface ICategoryRepository
    {
        IEnumerable<Category> GetAll();
        void Update(Category category);
        Category Delete(Guid categoryId);
        void Insert(Category category);
    }
}
