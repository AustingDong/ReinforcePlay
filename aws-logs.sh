#!/bin/bash

# Display logs for both services

SERVICE=${1:-both}

case $SERVICE in
    backend)
        echo "📊 Backend Logs (Ctrl+C to exit):"
        echo "================================================"
        sudo journalctl -u reinforceplay-backend -f
        ;;
    frontend)
        echo "📊 Frontend Logs (Ctrl+C to exit):"
        echo "================================================"
        sudo journalctl -u reinforceplay-frontend -f
        ;;
    both)
        echo "📊 Service Logs (Ctrl+C to exit):"
        echo "================================================"
        echo ""
        echo "Last 20 lines from each service:"
        echo ""
        echo "--- Backend ---"
        sudo journalctl -u reinforceplay-backend -n 20 --no-pager
        echo ""
        echo "--- Frontend ---"
        sudo journalctl -u reinforceplay-frontend -n 20 --no-pager
        echo ""
        echo "================================================"
        echo "Following live logs (both services)..."
        echo "================================================"
        sudo journalctl -u reinforceplay-backend -u reinforceplay-frontend -f
        ;;
    *)
        echo "Usage: ./aws-logs.sh [backend|frontend|both]"
        echo ""
        echo "Examples:"
        echo "  ./aws-logs.sh            # View both (default)"
        echo "  ./aws-logs.sh backend    # View backend only"
        echo "  ./aws-logs.sh frontend   # View frontend only"
        exit 1
        ;;
esac

