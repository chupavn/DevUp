using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DevUp.Helpers
{
    public static partial class Enumerable
    {
        public static IEnumerable<TSource> WhereIf<TSource>(this IEnumerable<TSource> source, bool condition, Func<TSource, bool> predicate)
        {
            return condition ? source.Where(predicate) : source;
        }
    }

    public static partial class Queryable
    {
        public static IQueryable<TSource> WhereIf<TSource>(this IQueryable<TSource> source, bool condition, Expression<Func<TSource, bool>> predicate)
        {
            return condition ? source.Where(predicate) : source;
        }

        public static IQueryable<TSource> TakeIfHasValue<TSource>(this IQueryable<TSource> source, int? take)
        {
            return take.HasValue ? source.Take(take.Value) : source;
        }
    }
}
