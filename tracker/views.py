from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, ExpenseSerializer, CategorySerializer, BudgetSerializer
from .models import Expense, Category, Budget
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Sum, Q
from .filters import ExpenseFilter


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=RegisterSerializer)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ExpenseFilter
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Expense.objects.filter(user=user)

        category = self.request.query_params.get("category")
        min_amount = self.request.query_params.get("min_amount")
        max_amount = self.request.query_params.get("max_amount")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if category:
            queryset = queryset.filter(category__id=category)
        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)
        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset.order_by("-date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(
        parameters=[
            OpenApiParameter(name='category', description='Category ID', required=False, type=int),
            OpenApiParameter(name='amount', description='Amount of expense', required=False, type=Decimal),
            OpenApiParameter(name='date', description='Date of expense (YYYY-MM-DD)', required=False, type=str),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def summary_view(request):
    user = request.user
    expenses = Expense.objects.filter(user=user)

    total_income = sum(exp.amount for exp in expenses if exp.amount > 0)
    total_expenses = sum(-exp.amount for exp in expenses if exp.amount < 0)
    balance = total_income - total_expenses

    return Response({
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_summary(request):
    user = request.user
    budget = Budget.objects.filter(user=user).first()
    limit = budget.total_budget if budget else 0

    total_expense = Expense.objects.filter(user=user, amount__lt=0).aggregate(
        total=Sum('amount')
    )['total'] or 0

    return Response({
        "limit": limit,
        "actual": abs(total_expense)
    })
