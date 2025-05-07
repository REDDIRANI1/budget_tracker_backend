import django_filters
from .models import Expense

class ExpenseFilter(django_filters.FilterSet):
    amount = django_filters.NumberFilter(field_name="amount")
    date = django_filters.DateFilter(field_name="date")

    class Meta:
        model = Expense
        fields = ['amount', 'category', 'date']
